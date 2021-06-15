import { color } from 'd3-color';
import { range } from 'd3-array';
import { format } from 'd3-format';
const toNumber=require("lodash/toNumber");
const toString=require("lodash/toString");
const isString=require("lodash/isString");
const replace=require("lodash/replace");
const f2 = format('.2f');
const f0 = format('.0f');
const out_of_china = function out_of_china(lng, lat) {
	// const lat = +lat;
	// const lng = +lng;
	 lat = +lat;
	 lng = +lng;
	// 纬度3.86~53.55,经度73.66~135.05
	return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};

const transformlat = function transformlat(lng, lat) {
	// const lat = +lat;
	// const lng = +lng;
	 lat = +lat;
	 lng = +lng;
	let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
	ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
	ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
	return ret;
};

const transformlng = function transformlng(lng, lat) {
	// const lat = +lat;
	// const lng = +lng;
	 lat = +lat;
	 lng = +lng;
	let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
	ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
	ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
	return ret;
};
const base = {
	generateUUID() {
		let dt = new Date().getTime();
		let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});
		return uuid;
	},
	dateFormat(date, fmt) {
		date = new Date(date);
		const o = {
			'M+': date.getMonth() + 1, //月份
			'D+': date.getDate(), //日
			'H+': date.getHours(), //小时
			'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
			'm+': date.getMinutes(), //分
			's+': date.getSeconds(), //秒
			S: date.getMilliseconds(), //毫秒
			X: '星期' + '日一二三四五六'.charAt(date.getDay()),
			W: new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')[date.getDay()],
			w: new Array('Sun.', 'Mon.', ' Tues.', 'Wed.', ' Thur.', 'Fri.', 'Sat.')[date.getDay()],
		};
		if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp('(' + k + ')').test(fmt))
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
		return fmt;
	},
	getTicksOfAxis(domain, ticksCount) {
		const len = domain.length;
		if (ticksCount < 2 || ticksCount > len) return domain;
		const step = Math.floor((len - ticksCount) / (ticksCount - 1));
		return domain.filter((d, i) => i % (step + 1) === 0);
	},
	converColor(originColor, base = 255) {
		let { r, g, b, opacity = 1 } = color(originColor);
		return {
			r: r / base,
			g: g / base,
			b: b / base,
			a: opacity,
		};
	},
	coordToVector(longitude, latitude, width, height) {
		let x = (+longitude + 180) * (width / 360),
			latRad = (+latitude * Math.PI) / 180,
			mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2)),
			y = height / 2 - (width * mercN) / (2 * Math.PI);
		x = x - width / 2;
		y = y - height / 2;
		return { x, y: -y };
	},
	clearMyInterval(interval) {
		clearInterval(interval);
		interval = null;
	},

	generateUUID() {
		let dt = new Date().getTime();
		let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});
		return uuid;
	},

	getYTicks(max, min, count) {
		count--;
		const piece = (max - min) / count;
		const ticks = range(0, count).map(item => {
			let value = item * piece + +min;
			return +((value > -1 && value < 1 && value !== 0) || piece.toString().indexOf('.') > -1
				? f2(value)
				: f0(value));
		});
		return [...ticks, max];
	},
	degToRad(angle) {
		return (Math.PI / 180) * angle;
	},
	lglt2xyz(longitude, latitude, radius) {
		let lg = degToRad(longitude),
			lt = degToRad(latitude),
			y = radius * Math.sin(lt),
			temp = radius * Math.cos(lt),
			x = temp * Math.sin(lg),
			z = temp * Math.cos(lg);
		return { x, y, z };
	},
	toFixed(number, fractionDigits) {
		let times = Math.pow(10, fractionDigits);
		let roundNum = Math.round(number * times) / times;
		return roundNum.toFixed(fractionDigits);
	},
	formattingFn(settings, value) {
		const { decimalSymbol = '.', decimal, zeroNum, quartile, real = true } = settings;
		const neg = value < 0;
		let num = toFixed(Math.abs(value), decimal);
		const x = num.split('.');
		let x1 = x[0];
		const x2 = x.length > 1 ? `${decimalSymbol}${x[1]}` : '';
		const rgx = /(\d+)(\d{3})/;
		if (real && zeroNum) {
			//0补位
			x1 = ('0'.repeat(zeroNum) + x1).slice(-zeroNum);
		}
		if (real && quartile) {
			//千分位
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, `$1${','}$2`);
			}
		}
		return `${neg ? '-' : ''}${x1}${x2}${!real ? '%' : ''}`;
	},
	noRound(value, decimal) {
		let numArr = value.toString().split('.'),
			cent = numArr[1];
		if (decimal > 0) {
			cent = cent ? cent : '';
			cent = (cent + '0'.repeat(decimal)).slice(0, decimal);
			return numArr[0] + '.' + cent;
		} else {
			return numArr[0];
		}
	},
	getBackground(background) {
		if (!background) {
			return;
		}
		let { fillType, colors, color, url } = background;
		return fillType === 'pure'
			? color
			: fillType === 'gradient'
			? 'linear-gradient(' + (colors.rotate || 0) + 'deg, ' + colors.start + ' 0%, ' + colors.end + ' 100%)'
			: url
			? '50% 50% / 100% 100% no-repeat url(' + window.appConfig.ASSETS_URL + url + ')'
			: '';
	},
	wgs84togcj02(lnglat) {
		// export function wgs84togcj02(lng, lat) {
		let lng = lnglat[0],
			lat = lnglat[1];

		lat = +lat;
		lng = +lng;
		if (out_of_china(lng, lat)) {
			return [lng, lat];
		} else {
			let dlat = transformlat(lng - 105.0, lat - 35.0);
			let dlng = transformlng(lng - 105.0, lat - 35.0);
			let radlat = (lat / 180.0) * PI;
			let magic = Math.sin(radlat);
			magic = 1 - ee * magic * magic;
			let sqrtmagic = Math.sqrt(magic);
			dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
			dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
			let mglat = lat + dlat;
			let mglng = lng + dlng;
			return [mglng, mglat];
		}
	},

	getDistance(startX, startY, endX, endY) {
		return Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
	},

	getRatio() {
		let { transform } = document.body.style;
		let widthRatio = 1,
			heightRatio = 1;
		let scale = transform.split('scale(')[1];
		if (scale) {
			if (/,/.test(scale)) {
				let [wR, hR] = scale.split(',');
				widthRatio = parseFloat(wR);
				heightRatio = parseFloat(hR);
			} else {
				widthRatio = heightRatio = parseFloat(scale);
			}
		}
		return { widthRatio, heightRatio };
	},
	replacePxToNumber(str) {
		let handledStr = str;
		if (!isString(handledStr)) {
			handledStr = toString(handledStr);
		}
		return toNumber(replace(handledStr, /px/g, ''));
    },
    dataStr2Num(data, keys = ['y', 'z', 'p']) {
        return data.map((item) => {
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key in item) {
              return {
                ...item,
                [key]: +item[key],
              };
            }
          }
          return item;
        });
      } 
};

export default base;
