import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LocationsProps {
  open: boolean;
  handleClose: () => void;
}

const HowToPray: React.FC<LocationsProps> = ({ open, handleClose }) => {
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
        Kako obaviti namaz?
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
        <Typography
          variant="h5"
          gutterBottom
          sx={{ m: 0, p: 2, fontFamily: "Poppins, sans-serif" }}
        >
          Šta je namaz?
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{ m: 0, p: 2, fontFamily: "Poppins, sans-serif" }}
        >
          Namaz je temeljni oblik ibadeta u islamu, što je direktna veza između
          muslimana i njegovog Stvoritelja, Allaha dž.š. Sastoji se od niza
          propisanih tjelesnih pokreta i učenja odlomaka Kur'ana, a obavlja se
          pet puta dnevno (sabah, podne, ikindija, akšam i jacija) u određeno
          vrijeme. Namaz se smatra jednim od pet stubova islama i obavezan je za
          sve muslimane punoljetne dobi i umnog zdravlja.
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ m: 0, p: 2, fontFamily: "Poppins, sans-serif" }}
        >
          Kako se obavlja namaz?
        </Typography>
        <Typography sx={{ m: 0, p: 2, fontFamily: "Poppins, sans-serif" }}>
          Namaz se ispravno obavlja uz poštivanje čistoće tijela uzimanjem
          abdesta ili gusula, čistoće mjesta na kojem se klanja, pravilnog
          položaja tijela, jasne namjere, pridržavanja pravilnog vremena i
          okretanja prema Kabi u Meki.
        </Typography>

        <Typography sx={{ m: 0, p: 2, fontFamily: "Poppins, sans-serif" }}>
          Detaljan praktičan vodič o uzimanju abdesta i klanjanju namaza možete
          pogledati{" "}
          <a
            href="https://kako-klanjati.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ovdje
          </a>
          .
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPray;
