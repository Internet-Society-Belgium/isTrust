import { expect, test } from "vitest";
import { improve_array } from "./array";

test('addNewValue(undefined, "value")',  () => {
  expect(improve_array(undefined, "value")).toStrictEqual(["value"]);
});

test('addNewValue([], "value")',  () => {
  expect(improve_array([], "value")).toStrictEqual(["value"]);
});

test('addNewValue(["value"], "value")',  () => {
  expect(improve_array(["value"], "value")).toStrictEqual(["value"]);
});

test('addNewValue(["value1"], "value2")',  () => {
  expect(improve_array(["value1"], "value2")).toStrictEqual([
    "value1",
    "value2",
  ]);
});
