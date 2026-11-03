import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';

// Removes the drawed components after each test, such that test does not influence each other
afterEach(() => {
    cleanup();
});