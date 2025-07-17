import { expect, test } from "vitest";
import { addNewValue } from "./value";

test('addNewValue(undefined, "value")', async () => {
  expect(addNewValue(undefined, "value")).toStrictEqual(["value"]);
});

test('addNewValue([], "value")', async () => {
  expect(addNewValue([], "value")).toStrictEqual(["value"]);
});

test('addNewValue(["value"], "value")', async () => {
  expect(addNewValue(["value"], "value")).toStrictEqual(["value"]);
});

test('addNewValue(["value1"], "value2")', async () => {
  expect(addNewValue(["value1"], "value2")).toStrictEqual(["value1", "value2"]);
});
