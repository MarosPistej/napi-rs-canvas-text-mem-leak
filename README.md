### HOW TO USE

- `npm i`
- to test `napi-rs/canvas` use `http://localhost:3000/canvas`, for `skia-canvas` use `http://localhost:3000/skia-canvas`

replace `currentTest` value on line `64` of `index.js` for desired test
run `npm test`
use `ab -c50 -n10000 REPLACE_WITH_URL`

#### TESTS

1. `lineTo` - work ok
2. `text` - pass with memory leak (observe in activiti monitor / task manager)
3. `arc` - crash with segmentation fault after few seconds / thousands req completed (may be system dependant, run on Apple M1, 16GB RAM)
4. `bezier` - crash with segmentation fault after few seconds / thousands req completed (may be system dependant, run on Apple M1, 16GB RAM)
5. `rect` - crash with segmentation fault after few seconds / thousands req completed (may be system dependant, run on Apple M1, 16GB RAM)
