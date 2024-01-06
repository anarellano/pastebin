# args.py
import argparse


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--sqlite-file-path",
        default="pastes.db",
        help="The path to the SQLite database file.",
    )

    parser.add_argument("--host", default="localhost", help="add an IP adress")

    parser.add_argument("--port", type=int, default=8000, help="put numbers for port")

    return parser.parse_args()
