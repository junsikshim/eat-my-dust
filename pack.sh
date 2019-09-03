rm -f eatmydust.zip

rm -f dist/*.js
rm -f dist/*.css
rm -f dist/.DS_Store
rm -f dist/images/.DS_Store

cd dist; zip -r -9 -X ../eatmydust.zip *; cd ..