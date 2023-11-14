import { createGlobalStyle } from "styled-components/macro";
import Anton from "../assets/fonts/Anton/Anton-Regular.ttf";
import PoppinsThin from "../assets/fonts/Poppins/Poppins-Thin.ttf";
import PoppinsExtraLight from "../assets/fonts/Poppins/Poppins-ExtraLight.ttf";
import PoppinsLight from "../assets/fonts/Poppins/Poppins-Light.ttf";
import PoppinsRegular from "../assets/fonts/Poppins/Poppins-Regular.ttf";
import PoppinsMedium from "../assets/fonts/Poppins/Poppins-Medium.ttf";
import PoppinsSemiBold from "../assets/fonts/Poppins/Poppins-SemiBold.ttf";
import PoppinsBold from "../assets/fonts/Poppins/Poppins-Bold.ttf";
import PoppinsExtraBold from "../assets/fonts/Poppins/Poppins-ExtraBold.ttf";
import PoppinsBlack from "../assets/fonts/Poppins/Poppins-Black.ttf";

const FontStyles = createGlobalStyle`

@font-face {
  font-family: 'Anton';
  src: url(${Anton});
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsThin});
  font-weight: 100;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsExtraLight});
  font-weight: 200;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsLight});
  font-weight: 300;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsRegular});
  font-weight: 400;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsMedium});
  font-weight: 500;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsSemiBold});
  font-weight: 600;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsBold});
  font-weight: 700;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsExtraBold});
  font-weight: 800;
}

@font-face {
  font-family: "Poppins";
  src: url(${PoppinsBlack});
  font-weight: 900;
}

@font-face {
  font-family: "Anton";
  src: url(${Anton});
  font-weight: 400;
}

$font-stack: "Poppins", sans-serif;

$font-stack: "Anton", sans-serif;
`;

export default FontStyles;
