import React from "react";
import Confirm from "@/assets/icons/Confirm";
import ErrorSvg from "@/assets/icons/Error";
import Warning from "@/assets/icons/Warning";
import CountryCad from "@/assets/icons/CountryCad";
import CallBack from "@/assets/icons/CallBack";
import Contrast from "@/assets/icons/Contrast";
import Settings from "@/assets/icons/Settings";
import Encriptados from "@/assets/icons/Encriptados";
import Info from "@/assets/icons/Info";
import MultipleSettings from "@/assets/icons/MultipleSettings";
import Sim from "@/assets/icons/Sim";
import VoiceChange from "@/assets/icons/VoiceChange";
import FilterSoundLight from "@/assets/icons/FilterSoundLight";
import VerificationWarning from "@/assets/icons/VerificationWarning";
import Copy from "@/assets/icons/Copy";
import VerificationFailed from "@/assets/icons/VerificationFailed";
import ArrowUp from "@/assets/icons/ArrowUp";
import Close from "@/assets/icons/Close";
import ArrowDown from "@/assets/icons/ArrowDown";
import ArrowBack from "@/assets/icons/ArrowBack";
import Sim2 from "@/assets/icons/Sim2";
import RadioChecked from "@/assets/icons/RadioChecked";
import RadioUnchek from "@/assets/icons/RadioUnchek";
import Add from "@/assets/icons/Add";
import Wifi from "@/assets/icons/Wifi";
import SafetyClock from "@/assets/icons/SafetyClock";

import Change from "@/assets/icons/Change";
import Delete from "@/assets/icons/Delete";
import VerificationSuccess from "@/assets/icons/VerificationSuccess";
import AccountCode from "@/assets/icons/AccountCode";
import Wallet from "@/assets/icons/Wallet";
import Phone from "@/assets/icons/Phone";
import ShopIconMenu from "@/assets/icons/ShopIconMenu";
import HomeIconMenu from "@/assets/icons/HomeIconMenu";
import ArrowRight from "@/assets/icons/ArrowRight";
import Bell from "@/assets/icons/Bell";
import Bag from "@/assets/icons/Bag";
import CodeSafe from "@/assets/icons/CodeSafe";
import X from "@/assets/icons/X";
import Telegram from "@/assets/icons/Telegram";
import Linkedin from "@/assets/icons/Linkedin";
import Instagram from "@/assets/icons/Instagram";
import Youtube from "@/assets/icons/Youtube";
import SpiralIcon from "@/assets/icons/SpiralIcon";
import EraseText from "@/assets/icons/EraseText";
import UserPassword from "@/assets/icons/UserPassword";
import Money from "@/assets/icons/Money";
import CheckStepper from "@/assets/icons/CheckStepper";
import ShopStepper from "@/assets/icons/ShopStepper";
import Edit from "@/assets/icons/Edit";
import ConfirmGreen from "@/assets/icons/ConfirmGreen";

interface IconSvgProps {
  type:
    | "accountcode"
    | "verificationsuccess"
    | "deleteicon"
    | "change"
    | "wallet"
    | "phone"
    | "safetyclock"
    | "wifi"
    | "add"
    | "radiounchek"
    | "radiochecked"
    | "sim2"
    | "arrowback"
    | "closeicon"
    | "arrowupicon"
    | "verificationiconfailed"
    | "copyicon"
    | "verificationwarning"
    | "themeicon"
    | "filtericon"
    | "voicechange"
    | "sim"
    | "multiplesettings"
    | "info"
    | "encriptados"
    | "confirm"
    | "error"
    | "alert"
    | "countrycad"
    | "callback"
    | "contrast"
    | "settings"
    | "homeiconmenu"
    | "shopiconmenu"
    | "arrowright"
    | "bag"
    | "bell"
    | "codesafe"
    | "telegram"
    | "linkedin"
    | "instagram"
    | "youtube"
    | "erasetext"
    | "spiral"
    | "userpassword"
    | "money"
    | "checkstepper"
    | "shopstepper"
    | "x"
    | "confirmgreen"
    | "edit";

  height?: number;
  width?: number;
  color?: string;
}

const IconSvg: React.FC<IconSvgProps> = ({ type, height, width, color }) => {
  switch (type) {
    case "confirm":
      return <Confirm height={height} width={width} />;
    case "confirmgreen":
      return <ConfirmGreen height={height} width={width} />;

    case "edit":
      return <Edit height={height} width={width} />;
    case "error":
      return <ErrorSvg height={height} width={width} />;
    case "alert":
      return <Warning height={height} width={width} />;

    case "arrowright":
      return <ArrowRight color={color} height={height} width={width} />;

    case "countrycad":
      return <CountryCad height={height} width={width} />;

    case "callback":
      return <CallBack color={color} height={height} width={width} />;

    case "contrast":
      return <Contrast color={color} height={height} width={width} />;

    case "settings":
      return <Settings color={color} height={height} width={width} />;

    case "encriptados":
      return <Encriptados color={color} height={height} width={width} />;

    case "info":
      return <Info color={color} height={height} width={width} />;

    case "multiplesettings":
      return <MultipleSettings color={color} height={height} width={width} />;

    case "sim":
      return <Sim color={color} height={height} width={width} />;

    case "voicechange":
      return <VoiceChange color={color} height={height} width={width} />;

    case "filtericon":
      return <FilterSoundLight color={color} height={height} width={width} />;

    case "themeicon":
      return <Contrast height={height} width={width} />;

    case "verificationwarning":
      return (
        <VerificationWarning color={color} height={height} width={width} />
      );

    case "copyicon":
      return <Copy color={color} height={height} width={width} />;

    case "verificationiconfailed":
      return <VerificationFailed height={height} width={width} />;

    case "arrowupicon":
      return <ArrowUp height={height} width={width} />;

    case "closeicon":
      return <Close height={height} width={width} color={color} />;

    case "arrowback":
      return <ArrowBack height={height} width={width} />;

    case "sim2":
      return <Sim2 height={height} width={width} />;

    case "radiochecked":
      return <RadioChecked height={height} width={width} />;

    case "radiounchek":
      return <RadioUnchek height={height} width={width} />;

    case "add":
      return <Add height={height} width={width} />;

    case "wifi":
      return <Wifi color={color} height={height} width={width} />;

    case "safetyclock":
      return <SafetyClock color={color} height={height} width={width} />;

    case "phone":
      return <Phone color={color} height={height} width={width} />;
    case "wallet":
      return <Wallet color={color} height={height} width={width} />;

    case "change":
      return <Change color={color} height={height} width={width} />;
    case "deleteicon":
      return <Delete height={height} width={width} />;

    case "verificationsuccess":
      return <VerificationSuccess height={height} width={width} />;
    case "accountcode":
      return <AccountCode height={height} width={width} />;

    case "shopiconmenu":
      return <ShopIconMenu color={color} height={height} width={width} />;

    case "homeiconmenu":
      return <HomeIconMenu color={color} height={height} width={width} />;

    case "bell":
      return <Bell color={color} height={height} width={width} />;

    case "bag":
      return <Bag color={color} height={height} width={width} />;

    case "codesafe":
      return <CodeSafe color={color} height={height} width={width} />;

    case "x":
      return <X color={color} height={height} width={width} />;

    case "telegram":
      return <Telegram color={color} height={height} width={width} />;

    case "linkedin":
      return <Linkedin color={color} height={height} width={width} />;

    case "instagram":
      return <Instagram color={color} height={height} width={width} />;
    case "youtube":
      return <Youtube color={color} height={height} width={width} />;

    case "spiral":
      return <SpiralIcon color={color} height={height} width={width} />;

    case "erasetext":
      return <EraseText color={color} height={height} width={width} />;

    case "userpassword":
      return <UserPassword color={color} height={height} width={width} />;
    case "money":
      return <Money color={color} height={height} width={width} />;

    case "checkstepper":
      return <CheckStepper color={color} height={height} width={width} />;

    case "shopstepper":
      return <ShopStepper color={color} height={height} width={width} />;

    default:
      return null;
  }
};

export default IconSvg;
