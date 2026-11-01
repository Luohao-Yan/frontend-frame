"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * @origin Apache-2.0 / fde-workspace (src/components/ui/aspect-ratio.tsx)
 */
function AspectRatio({
	...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
	return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
