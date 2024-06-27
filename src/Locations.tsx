import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LocationsProps {
  open: boolean;
  handleClose: () => void;
  handleCityClick: (location: string, index: number) => void;
  data: string[];
}

const Locations: React.FC<LocationsProps> = ({
  open,
  handleClose,
  handleCityClick,
  data,
}) => {
  const closeClick = (location: string, index: number) => {
    handleCityClick(location, index);
    handleClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, fontFamily: "Poppins, sans-serif" }}
        id="customized-dialog-title"
      >
        Lokacije:
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ul>
          {data.map((location, index) => (
            <Button
              key={index}
              sx={{ color: "#a2aba3", fontFamily: "Poppins, sans-serif" }}
              onClick={() => closeClick(location, index)}
            >
              {location}
            </Button>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default Locations;
