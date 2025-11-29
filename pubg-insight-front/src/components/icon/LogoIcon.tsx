type Props = {
    viewBox?: string
    color?: string
};

export default function icon({
    viewBox = "0 0 200 200",
    color = "var(--color-main)"
}: Props) {
    return <>
        <svg
            viewBox={viewBox}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <mask id="pinHoleMask">
                <rect x="0" y="0" width="200" height="200" fill="white" />

                <path
                    d="M72 46
                    A 30 30 0 1 1 128 46
                    L100 100
                    Z"
                    stroke="black"
                    stroke-width="10"
                    fill="none"
                />
                <path
                    d="M72 46
                    A 30 30 0 1 1 128 46
                    L100 100
                    Z"
                    fill="white"
                />
                <circle cx="100" cy="35" r="20" fill="black" />
            </mask>

            <g mask="url(#pinHoleMask)">
                <rect x="25" y="30" width="150" height="150" rx="10" stroke={color} stroke-width="5" fill="none" />

                <line x1="75" y1="30" x2="75" y2="180" stroke={color} stroke-width="5" />
                <line x1="125" y1="30" x2="125" y2="180" stroke={color} stroke-width="5" />

                <line x1="25" y1="80" x2="175" y2="80" stroke={color} stroke-width="5" />
                <line x1="25" y1="130" x2="175" y2="130" stroke={color} stroke-width="5" />

                <path
                    d="M72 46
                    A 30 30 0 1 1 128 46
                    L100 100
                    Z"
                    fill={color}
                    stroke={color}
                    stroke-width="3"
                />
            </g>
        </svg>
    </>
}