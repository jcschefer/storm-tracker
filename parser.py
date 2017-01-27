#
from os     import listdir
from json   import dump
#
############################################################
#
def main():
    #
    for fname in listdir( 'raw_data' ):
        #
        if fname.endswith( '.data' ):
            #
            print( 'parsing file', fname, '...' )
            with open( 'json_data/' + fname.replace('.data', '.json'), 'w' ) as outf:
                dump( parse_file( fname ), outf, sort_keys=True, indent=4)
            #
        #
    #
#
############################################################
#
def parse_file( path ):
    #
    years   = {}
    year    = []
    storm   =  []
    #
    current_year    = '1970'
    current_storm   = '1'
    #
    with open( 'raw_data/' + path, 'r' ) as f:
        #
        for line in f:
            #
            arr = line.split()
            #
            if arr[ 0 ] != current_year:
                #
                years[ current_year ]   = year
                year                    = []
                current_year            = arr[ 0 ]
                current_storm           = '1'
                #
            #
            if arr[ 4 ] != current_storm:
                #
                year.append( storm )
                storm = []
                current_storm = arr[ 4 ]
                #
            #
            storm.append({'lat':arr[7], 'lon':arr[8], 'speed':arr[9]})
            #
        #
    #
    return years
    #
#
############################################################
#
if __name__ == '__main__':
    #
    main()
    #
#
# End of file.
