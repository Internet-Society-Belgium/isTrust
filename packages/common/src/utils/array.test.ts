import { expect, test } from "vitest";
import { improve_array } from "./array";

test('addNewValue(undefined, "value")', async () => {
  expect(improve_array(undefined, "value")).toStrictEqual(["value"]);
});

test('addNewValue([], "value")', async () => {
  expect(improve_array([], "value")).toStrictEqual(["value"]);
});

test('addNewValue(["value"], "value")', async () => {
  expect(improve_array(["value"], "value")).toStrictEqual(["value"]);
});

test('addNewValue(["value1"], "value2")', async () => {
  expect(improve_array(["value1"], "value2")).toStrictEqual([
    "value1",
    "value2",
  ]);
});
