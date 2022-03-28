import { ToggleButton, ToggleButtonProps, Tooltip, TooltipProps } from "@mui/material";
import { forwardRef, VFC } from "react";

type TooltipToggleButtonProps = ToggleButtonProps & {
    TooltipProps: Omit<TooltipProps, 'children'>
};

const TooltipToggleButton: VFC<TooltipToggleButtonProps> = forwardRef(
    ({ TooltipProps, ...props }, ref) => {
        return (
            <Tooltip key={props.key} {...TooltipProps}>
                <ToggleButton ref={ref} {...props} />
            </Tooltip>
        )
    }
)

export default TooltipToggleButton;