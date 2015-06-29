rm subunits.json
rm places.json

ogr2ogr \
  -f GeoJSON \
  subunits.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "SCALERANK < 4" \
  places.json \
  ne_10m_populated_places/ne_10m_populated_places.shp

topojson \
  -o world.json \
  -s 1e-5 \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  subunits.json \
  places.json
