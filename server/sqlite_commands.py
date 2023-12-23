import sqlite3
import string
import random

# table: pastes_table


def connect_db(db_path):
    db = sqlite3.connect(
        db_path, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    cursor = db.cursor()
    return db, cursor


def create_name(length=10):
    letters_digits = string.ascii_letters + string.digits
    random_alias = []

    for i in range(length):
        random_string = random.choice(letters_digits)
        random_alias.append(random_string)

    new_name = "".join(random_alias)

    return new_name


# inserts the name and path in db
def insert_text(db_path, name, path):
    db, cursor = connect_db(db_path)
    print({"name": name, "path": path}, flush=True)
    cursor.execute(
        "INSERT INTO pastes_table (name, path) VALUES ( ?, ? )", (name, path)
    )
    db.commit()
    db.close()


def find_name(db_path, name):
    db, cursor = connect_db(db_path)
    cursor.execute("SELECT * FROM pastes_table WHERE name = ?", (name,))
    find = cursor.fetchone()
    print(find, flush=True)
    db.close()
    if find is None:
        return None
    return find


def fetch_all(db_path):
    db, cursor = connect_db(db_path)
    cursor.execute(
        'SELECT name, date_created as "[timestamp]" FROM pastes_table ORDER BY date_created DESC LIMIT 5'
    )
    all_records = cursor.fetchall()
    print("hey", all_records, flush=True)
    db.close()
    return all_records
