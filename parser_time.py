from os import listdir
from json import dump
from datetime import datetime

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, datetime):
        serial = obj.isoformat()
        return serial
    raise TypeError ("Type not serializable")


def main():
    for fname in listdir('raw_data'):
        if fname.endswith('.data'):
            print('parsing file', fname, '...')
            with open('json_data/' + fname.replace('.data', '_time.json'), 'w') as outf:
                dump(parse_by_time(fname), outf, sort_keys=True, indent=4, default=json_serial)


def parse_by_time(path):
    sequence = []
    with open('raw_data/' + path, 'r') as f:
        for line in f:
            cols = line.split()
            date = datetime(year=int(cols[0]), month=int(cols[1]), day=int(cols[2]), hour=int(cols[3]))
            # date = cols[0] + '/' + cols[1] + '/' + cols[2] + ':' + cols[3]
            lon = 360.0 - float(cols[8])
            sequence.append({'time': date, 'lat': float(cols[7]), 'lon': int(lon * 100 + 0.5) / 100.0, 'speed': int(cols[9]), 'storm': int(cols[4])})
    sequence.sort(key=lambda a: a['time'])
    return sequence


if __name__ == '__main__':
    main()
