
####################################################
#  Note, this is unstable and doesn't really work. #
####################################################


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
    outf = open('json_data/world.json', 'w')
    sequence = []
    for fname in listdir('raw_data'):
        if fname.endswith('.data'):
            print('parsing file', fname, '...')
            with open('raw_data/' + fname, 'r') as f:
                for line in f:
                    line = line.replace('NOT NAMED', 'NOT_NAMED')
                    line = line.replace('IONE 1', 'IONE_1')
                    line = line.replace('IONE 2', 'IONE_3')
                    cols = line.split(' ')
                    cols = list(filter(None, cols))
                    date = datetime(year=int(cols[0]), month=int(cols[1]), day=int(cols[2]), hour=int(cols[3]))
                    # date = cols[0] + '/' + cols[1] + '/' + cols[2] + ':' + cols[3]
                    lon = 360.0 - float(cols[7])
                    try: sequence.append({'time': date, 'lat': float(cols[6]), 'lon': int(lon * 100 + 0.5) / 100.0, 'speed': int(cols[8]), 'storm': fname.replace('.data', '') + cols[4] })
                    except ValueError: print(line)
    sequence.sort(key=lambda a: a['time'])
    dump(sequence, outf, sort_keys=True, indent=4, default=json_serial)


if __name__ == '__main__':
    main()
