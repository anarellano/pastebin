import sqlite3
import string
import random


def connect_db(db_path):
    db = sqlite3.connect(
        db_path, detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    cursor = db.cursor()
    return db, cursor


def make_table(db_path):
    db, cursor = connect_db(db_path)
    try:
        cursor.execute(
            """
                CREATE TABLE IF NOT EXSISTS pastes_table (
                    id INTERGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    path TEXT NOT NULL,
                    used INTEGER DEFAULT 0
                )
                    
        """
        )
        db.commit()
        print("table 'pastes_table' checked/created successfully. ")
    except sqlite3.Error:
        print(sqlite3.Error)
    finally:
        db.close()


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


# fetch used top 10
def fetch_top10(db_path):
    db, cursor = connect_db(db_path)
    cursor.execute(
        """
                   SELECT used FROM pastes_table ORDER BY column DESC LIMIT 10
                   """
    )
    top10 = cursor.fetchall()
    print("top 10 URL's used", top10, flush=True)
    db.close()
    return top10


def used_increment(db_path, name):
    db, cursor = connect_db(db_path)
    try:
        cursor.execute(
            "UPDATE pastes_table SET used = used + 1 WHERE name = ?", (name,)
        )
    except sqlite3.Error:
        print(sqlite3.Error)
    finally:
        db.close
