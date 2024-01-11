# args.py
import argparse


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--sqlite-file-path",
        default="pastes.db",
        help=" The path to pastes.db",
    )

    parser.add_argument(
        "--host",
        default="localhost",
        help="ip address for server to listen on, defaults to localhost",
    )

    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="port for server to be hosted on, defaults to 8000",
    )

    return parser.parse_args()
