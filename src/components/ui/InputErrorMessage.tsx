interface Iprops {
msg?:string
}


export default function InputErrorMsg(props :Iprops) {
    const {msg  } = props;
  return msg ? <p className="ms-1 text-red-500 text-[16px]">{msg}</p> : null;
}