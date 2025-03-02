import { IloginInput, IregisterInput } from "../interfaces";

export const RegisterForm : IregisterInput[] = [
    {
        name: "username",
        placeholder: "username",
        type: "text",
        validation: {
            // required: {
            //     value: true,
            //     message: "username is required"
            // },
            // minLength: {
            //     value: 3,
            //     message: "username must be at least 3 chars"
            // },
            // maxLength: {
            //     value: 30,
            //     message: "username must be at most 30 chars"
            //     }
            required : true,
            minLength : 3,
            maxLength : 30
            }
        },
        {
            name: "email",
            placeholder: "Email@example.com",
            type: "email",
            validation: {
                // required: {
                //     value: true,
                //     message: "email is required"
                // },
                // pattern: {
                //     value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i,
                //     message: "invalid email"
                // }
                required : true,
                pattern : /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i
            }
        },
        {
            name: "password",
            placeholder: "Password",
            type: "password",
            validation: {
                // required: {
                //     value: true,
                //     message: "password is required"
                // },
                // minLength: {
                //     value: 8,
                //     message: "password must be at least 8 chars"
                // },
                // maxLength: {
                //     value: 20,
                //     message: "password must be at most 20 chars"
                // }
                required : true,
                minLength : 8,
                maxLength : 20
        }
    }
]

export const LoginForm: IloginInput[] = [
  {
    name: "identifier",
    placeholder: "Email@example.com",
    type: "email",
    validation: {
      // required: {
      //     value: true,
      //     message: "email is required"
      // },
      // pattern: {
      //     value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i,
      //     message: "invalid email"
      // }
      required : true,
      pattern : /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i
  }
  },

  {
    name: "password",
    placeholder: "Password",
    type: "password",
    validation: {
        // required: {
        //     value: true,
        //     message: "password is required"
        // },
        // minLength: {
        //     value: 8,
        //     message: "password must be at least 8 chars"
        // },
        // maxLength: {
        //     value: 20,
        //     message: "password must be at most 20 chars"
        // }
        required : true,
        minLength : 7,
        maxLength : 20
}
}
];