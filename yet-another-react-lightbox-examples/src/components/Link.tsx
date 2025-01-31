import { Link as RouterLink } from "react-router-dom";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";

export default function Link({ href, children, ...rest }: MuiLinkProps) {
  return (
    <MuiLink component={RouterLink} to={href} {...rest}>
      {children}
    </MuiLink>
  );
}
