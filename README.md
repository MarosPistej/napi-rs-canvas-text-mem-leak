## HOW TO USE

- `npm i`
- run `npm test`

## Problems

### Text memory leak

use `ab -c50 -n10000 'http://localhost:3000/canvas/text'`

test shouldn't crash but memory leak is observable in activity monitor / task manager, even after load ends, memory isn't freed

### `encode` segmentation fault crash

1. `lineTo` - use `ab -c50 -n10000 'http://localhost:3000/canvas/encode?test=line'`
2. `arc` - use `ab -c50 -n10000 'http://localhost:3000/canvas/encode?test=arc'`
3. `bezier` - use `ab -c50 -n10000 'http://localhost:3000/canvas/encode?test=bezier'`
4. `rect` - use `ab -c50 -n10000 'http://localhost:3000/canvas/encode?test=rect'`

   test would crash with segmentation error, if lineTo test is run with lower load, it might not crash but can produce memory leak which which stay after load ends
