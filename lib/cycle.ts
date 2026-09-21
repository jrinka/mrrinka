// Teaching slots and bell times from cycle-calendar.html (01 Current Inbox).
// Wednesday P2 09:40 confirmed by Jason, September 21, 2026.
export const courseColors = { "English 10": "english", "IB Literature": "lit", "IB Language & Literature": "lang", "Mentoring 11.4": "mentor" } as const;
const rotation: (string|null)[][] = [
 ["English 10.4","IB Literature","Mentoring 11.4","English 10.5",null],
 ["English 10.6","IB Language & Literature","Mentoring 11.4",null,null],
 [null,"English 10.5","Mentoring 11.4","IB Literature","English 10.4"],
 [null,null,"Mentoring 11.4","IB Language & Literature","English 10.6"],
 ["IB Literature","English 10.4","Mentoring 11.4",null,"English 10.5"],
 ["IB Language & Literature","English 10.6","Mentoring 11.4",null,null],
 ["English 10.5",null,"Mentoring 11.4","English 10.4","IB Literature"],
 [null,null,"Mentoring 11.4","English 10.6","IB Language & Literature"],
];
export const bellTimes = {
 regular: ["08:15–09:35","09:45–11:05","11:45–12:30","12:35–13:55","14:05–15:25"],
 wednesday: ["08:15–09:35","09:40–11:00","","11:05–12:25","13:05–14:25"],
} as const;
const periods=["P1","P2","Mentoring","P3","P4"];
export function courseColor(name:string){return name.startsWith("English 10")?"english":name==="IB Literature"?"lit":name==="IB Language & Literature"?"lang":"mentor";}
export function daySchedule(day:number,wednesday=false){
 return (rotation[day-1]??[]).flatMap((course,index)=>!course||(wednesday&&index===2)?[]:[{course,period:periods[index],time:bellTimes[wednesday?"wednesday":"regular"][index],color:courseColor(course)}]);
}
export const cycleDays=rotation.map((_,i)=>({day:i+1,parity:(i%2?"EVEN":"ODD") as "ODD"|"EVEN",classes:daySchedule(i+1).filter(x=>x.period!=="Mentoring").map(x=>x.course)}));

const start = "2026-08-11";
const end = "2026-10-30";
const breakStart = "2026-09-25";
const breakEnd = "2026-10-05";

function iso(date: Date) { return date.toISOString().slice(0, 10); }
function isSchoolDay(date: Date) {
  const value = iso(date);
  const day = date.getUTCDay();
  return day >= 1 && day <= 5 && !(value >= breakStart && value <= breakEnd);
}

export type CycleDate = { date: string; cycleDay: number; parity: "ODD" | "EVEN" };

export const cycleDates: CycleDate[] = (() => {
  const result: CycleDate[] = [];
  let index = 0;
  for (let date = new Date(`${start}T12:00:00Z`); iso(date) <= end; date = new Date(date.getTime() + 86_400_000)) {
    if (!isSchoolDay(date)) continue;
    const cycleDay = (index % 8) + 1;
    result.push({ date: iso(date), cycleDay, parity: cycleDay % 2 ? "ODD" : "EVEN" });
    index += 1;
  }
  return result;
})();
