import {add, func} from "../src/index";

test("add", () =>
{
    expect(add(1, 1)).toBe(2);
});

test("gles", () =>
{
    expect(func()).toBe(true);
});