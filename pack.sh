rm eatmydust.zip

rm dist/*.js
rm dist/*.css
rm dist/images/a.png
rm dist/images/g.png
rm dist/.DS_Store
rm dist/images/.DS_Store

cd dist; zip -r -9 -X ../eatmydust.zip *; cd ..