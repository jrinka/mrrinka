import test from "node:test";
import assert from "node:assert/strict";
import {readTransfer} from "../lib/practice-transfer";
const item={version:1,id:"c621c061-5e55-46a6-91b1-82f356b67a3d",createdAt:1000,kind:"comparison",source:"Question workshop",prompt:"Question",evidence:"My notes",draft:"My claim"};
test("exercise transfer preserves writing for the intended tool and visit",()=>{
 assert.deepEqual(readTransfer(JSON.stringify(item),item.id,"comparison",2000),item);
 assert.equal(readTransfer(JSON.stringify(item),"another-id","comparison",2000),null);
 assert.equal(readTransfer(JSON.stringify(item),item.id,"analysis",2000),null);
});
test("exercise transfer rejects expired, future, malformed and oversized data",()=>{
 for(const [raw,now] of [[JSON.stringify(item),1801000],[JSON.stringify(item),999],["{",2000],[JSON.stringify({...item,draft:"x".repeat(8001)}),2000],[JSON.stringify({...item,version:2}),2000]] as const) assert.equal(readTransfer(raw,item.id,"comparison",now),null);
});
