var crypto = require('crypto');
var api = require('lardi-trans-api')('Sora1707', crypto.createHash('md5').update('sora17071987').digest('hex'));

// api.distance.calc(from, to).then(function(data) {
// 	console.log([from, to, data.total_range].join(','));
// });
console.dir(api.distance.calc())