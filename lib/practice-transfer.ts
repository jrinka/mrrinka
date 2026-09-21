import {z} from "zod";
export const transferKey="mrrinka:practice-transfer:v1";
const transferSchema=z.object({
 version:z.literal(1), id:z.string().uuid(), createdAt:z.number().finite(),
 kind:z.enum(["analysis","comparison"]), source:z.string().max(100),
 prompt:z.string().max(2000), evidence:z.string().max(10000), draft:z.string().max(8000),
});
export type PracticeTransfer=z.infer<typeof transferSchema>;
export function readTransfer(raw:string|null,id:string,kind:string,now=Date.now()):PracticeTransfer|null {
 try {const value=transferSchema.parse(JSON.parse(raw??"null"));
  return value.id===id&&value.kind===kind&&now>=value.createdAt&&now-value.createdAt<30*60*1000 ? value : null;
 } catch {return null;}
}
