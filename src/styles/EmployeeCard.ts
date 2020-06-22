export const employeeCardStyles = `
    background-color: #fff;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
    margin: 0px 10px 30px 10px;
    box-shadow: 1px 1px 9px #0000000d;

    i {
      color: dimgrey;
      margin-left: 8px;
      font-size: 18px;
    }

    &:hover{
      opacity: 0.6;
    }
`

export const employeeModalStyles = `
  .checkbox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 5px 15px 5px;

  input[type="checkbox"] { 
    display: none; 
  }

label {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 20px;
  color: #767676;
  line-height: 25px;
  cursor: pointer;
}

label:before  {
  content: '';
    display: block;
    width: 15px;
    height: 15px;
    border: 1px solid #969696;
    position: absolute;
    left: 0;
    top: 4px;
    opacity: .6;
    transition: all .12s,border-color .08s;
    border-radius: 4px  
}

input[type="checkbox"]:checked + label:before {
  width: 8px;
  top: 0px;
  left: 5px;
  border-radius: 0;
  opacity: 1;
  border-top-color: transparent;
  border-left-color: transparent;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
}

.feedbackBox { 
  background: #efefef;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 14px;

  label { 
    font-weight: bold;
  }
}

button {
  width: 100%;
}

h4 {
  text-align: center;
}

`
