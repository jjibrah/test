"""Migrate the SQLite orders.unit_price column from INTEGER to NUMERIC(10, 2)."""

import argparse
import sqlite3
from pathlib import Path


def migrate(database_path: Path) -> None:
    connection = sqlite3.connect(database_path)
    try:
        columns = {
            row[1]: row[2].upper()
            for row in connection.execute("PRAGMA table_info(orders)").fetchall()
        }
        if not columns:
            raise RuntimeError(f"orders table not found in {database_path}")
        if columns.get("unit_price") == "NUMERIC(10, 2)":
            print("unit_price is already NUMERIC(10, 2); no migration needed")
            return

        backup_path = database_path.with_name(
            f"{database_path.stem}.before_unit_price_numeric{database_path.suffix}"
        )
        with sqlite3.connect(backup_path) as backup:
            connection.backup(backup)

        connection.execute("BEGIN IMMEDIATE")
        connection.execute("ALTER TABLE orders RENAME TO orders_before_numeric")
        connection.execute("DROP INDEX IF EXISTS ix_orders_id")
        connection.execute(
            """
            CREATE TABLE orders (
                id INTEGER NOT NULL PRIMARY KEY,
                customer_name VARCHAR(120) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                product_name VARCHAR(160) NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price NUMERIC(10, 2) NOT NULL,
                status VARCHAR(10) NOT NULL,
                created_at DATETIME NOT NULL
            )
            """
        )
        connection.execute(
            """
            INSERT INTO orders (
                id, customer_name, customer_email, product_name,
                quantity, unit_price, status, created_at
            )
            SELECT
                id, customer_name, customer_email, product_name,
                quantity, CAST(unit_price AS NUMERIC), status, created_at
            FROM orders_before_numeric
            """
        )
        connection.execute("DROP TABLE orders_before_numeric")
        connection.execute("CREATE INDEX ix_orders_id ON orders (id)")
        connection.commit()
        print(f"Migrated {database_path}; backup written to {backup_path}")
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("database", nargs="?", default="orders.db", type=Path)
    args = parser.parse_args()
    migrate(args.database)
