import { useEffect } from "react";

type UseEnterKeySubmitOptions = {
	onSubmit: () => void;
	enabled?: boolean;
};

export const useEnterKeySubmit = ({
	onSubmit,
	enabled = true,
}: UseEnterKeySubmitOptions) => {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				onSubmit();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [onSubmit, enabled]);
};
