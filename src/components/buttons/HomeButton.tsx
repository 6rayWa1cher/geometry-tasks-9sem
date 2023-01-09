import type { ButtonProps } from "@mui/material";
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export const HomeButton = (props: ButtonProps) => {
  const navigate = useNavigate();
  const handleClick = () => navigate("/");
  return (
    <IconButton color="inherit" onClick={handleClick} {...props}>
      <HomeIcon />
    </IconButton>
  );
};
