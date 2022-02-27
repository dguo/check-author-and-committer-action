import {expect, test} from "@jest/globals";

import {checkField} from "../source/main";

test("Failing field", async () => {
    expect(() => {
        checkField({
            field: "author email",
            regex: "@github.com$",
            value: "foo@example.com"
        });
    }).toThrow();
});

test("Passing field", async () => {
    expect(() => {
        checkField({
            field: "author email",
            regex: "@example.com$",
            value: "foo@example.com"
        });
    }).not.toThrow();
});
