#!/usr/bin/env python
from pprint import pp
import re


def load_textfile(filename: str) -> list[str]:
    lijst = []
    with open(filename) as f:
        while True:
            line = f.readline()
            if not line:
                break

            l = line.strip()
            lijst.append(l)
    return lijst


def preplijst(lijst: list[str]) -> dict:
    dlijst = {}
    for entry in lijst:
        # pp(entry)
        k = {"source": entry}
        dlijst[entry] = k
        l = entry.lower()
        # pp(l)
        k["lower"] = l
        entry = re.sub("[^a-z]", "", l, count=0, flags=0)
        # pp(entry)
        l = list(entry)
        l.sort()
        key = "".join(l)
        # pp(key)
        k["key"] = key

    return dlijst


def main():
    anagrammen = load_textfile("anagrammen.txt")
    kandidaten = load_textfile("woordenlijst.txt")

    d_anagrammen = preplijst(anagrammen)
    d_kandidaten = preplijst(kandidaten)

    # pp(d_anagrammen)
    pp(d_kandidaten)

    for a in d_anagrammen:
        pp(a)
        key = d_anagrammen[a]["key"]

        for k in d_kandidaten:
            if d_kandidaten[k]["key"] == key:
                pp(d_kandidaten[k])


if __name__ == "__main__":
    main()
