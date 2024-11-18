import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Home from "./page";

test("App Router", () => {
	render(<Home />);
	expect(screen.findByTitle("bukubuku")).toBeDefined();
	expect(screen.findByText("bukubuku"));
});
