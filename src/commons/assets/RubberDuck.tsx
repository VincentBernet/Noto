import type { SVGProps } from "react";

type RubberDuckProps = {
	className?: string;
	size?: number;
} & SVGProps<SVGSVGElement>;

export const RubberDuck = ({ className, ...props }: RubberDuckProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
		<title>Rubber duck</title>
		<g fill="none" stroke="currentColor" strokeWidth="1.5">
			<path strokeLinecap="round" d="M7.501 6v.01"></path>
			<path
				strokeLinejoin="round"
				d="M4.627 6a4.002 4.002 0 0 1 7.874 1a4 4 0 0 1-1.354 3h5.831c1.379 0 2.023-1.12 2.023-2.5c3.5 3.5 2.969 7.5 2.969 7.5c0 3.5-3.469 6-8.969 6h-4.01a5.495 5.495 0 0 1-5.49-5.5a5.5 5.5 0 0 1 3.126-4.965A4 4 0 0 1 5.037 9m-.41-3L2.001 7c.19 1 1.063 2 3.035 2m-.409-3l.587.855A1.7 1.7 0 0 1 5.036 9"
			></path>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.001 18h1.5c2.21 0 5-2.79 5-5h-6.5a2.5 2.5 0 0 0 0 5"
			></path>
		</g>
	</svg>
);
