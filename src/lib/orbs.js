import { size, cash, render_mode, orbs as _orbs, rarity_key, auto_bounce, coll_rad, calcTrait, tps } from "../stores.js";
import draw from "../lib/draw.js";
import { abs, distance1, distance2, fixAng, numDiff, round, runNTimes } from "../lib/funcs.js";
import { get } from "svelte/store";

export const OrbM = (()=>{
	const collect = (orb)=>{
		cash.update(v => v + (calcTrait.value(orb)/(tps/2)));
	};

	const phys = {
		l: [],
		new(orb) { this.l.push(orb) },
		step(i) {
			const orb = this.l[i];
			orb.x += orb.vx;
			orb.y += orb.vy;

			if (orb.x-10 < 0) {
				orb.x = 10;
				orb.vx = abs(orb.vx);
			} else if (orb.y-10 < 0) {
				orb.y = 10;
				orb.vy = abs(orb.vy);
			}
			if (orb.x+10 > size.w) {
				orb.x = size.w-10;
				orb.vx = abs(orb.vx) * -1;
			} else if (orb.y > size.h-10) {
				orb.y = size.h-10;
				orb.vy = abs(orb.vy) * -1;
			}
		}
	};

	let orbs = [];
	_orbs.subscribe(v => orbs = v);
	
	return {
		update() {
			for (let i = 0; i < orbs.length; i++) {
				const orb = orbs[i];
				if (phys.l[i] == undefined) {
					phys.new({
						x: size.w*Math.random(), y: size.h*Math.random(),
						vx: 10, vy: 10,
					});
				}
				const { x, y } = phys.l[i];
				const ph = phys.l[i];
				
				ph.vy += 0.8 - (calcTrait.lessGravity(orb)*0.1);
				ph.vx *= Math.min(1, 0.99+(0.3*calcTrait.lessDrag(orb)));
				ph.vy *= Math.min(1, 0.99+(0.3*calcTrait.lessDrag(orb)));

				const coll_dist = distance1(ph.x, ph.y, size.w/2, size.h/3);
				if (coll_dist < get(coll_rad)) {
					collect(orb);
					draw.line1(size.w/2, size.h/3, x, y, "#99990066", 4);
				}

				const magnetic = calcTrait.magnetic(orb);
				if (magnetic > 0 && coll_dist > 50) {
					const coll_ang = Math.atan2(size.h/3-ph.y, size.w/2-ph.x);
					// draw.lineAtAngle(ph.x, ph.y, coll_ang, 100, "lime");
					ph.vx += Math.cos(coll_ang)/3 * magnetic;
					ph.vy += Math.sin(coll_ang)/3 * magnetic;
				}
				
				draw.circle(x,y, 10, rarity_key[orb.rarity].color);
				phys.step(i);
			}
		},
		bounce(auto=false) {
			for (let i = 0; i < phys.l.length; i++) {
				const ph = phys.l[i];
				if (ph.y < size.h - get(auto_bounce).size-20) continue;
				ph.vy -= 25 + 10*Math.random();
				if (auto) ph.vx += (size.w/2 - ph.x)/70;
				else if (this.mouse_x >= 0) ph.vx += (this.mouse_x - ph.x)/70;
				ph.vx += -0.5 + Math.random()
			}
		},
		mouse_x: -1,
		info: orbs, 
		get phys() { return phys; },
	};
})();