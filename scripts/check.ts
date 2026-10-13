import assert from "node:assert";
import { applicationSchema } from "../src/lib/validations";

const patch = applicationSchema.partial().parse({ status: "OFFER" });
assert.equal(patch.status, "OFFER");
assert.equal(patch.notes, undefined);
assert.equal(patch.salary, undefined);

const full = applicationSchema.parse({
  company: "A",
  position: "B",
  link: "",
  deadline: "",
});
assert.equal(full.link, null);
assert.equal(full.deadline, null);

assert.throws(() =>
  applicationSchema.parse({ company: "A", position: "B", link: "nope" }),
);
assert.throws(() =>
  applicationSchema.parse({ company: "A", position: "B", deadline: "garbage" }),
);

console.log("ok");
