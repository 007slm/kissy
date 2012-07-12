x({
    productions:[
        {
            symbol:"expressions",
            rhs:["e"],
            action:function (e) {
                alert(e);
            }
        },

        {
            symbol:"e",
            rhs:["e", "-", "e"],
            action:function (e1, _, e2) {
                return e1 - e2;
            }
        },
        {
            symbol:"e",
            rhs:["e", "+", "e"],
            action:function (e1, _, e2) {
                return e1 + e2;
            }
        },
        {
            symbol:"e",
            rhs:["NUMBER"],
            action:function (e) {
                return Number(e);
            }
        }/*,
         {
         symbol:"f",
         rhs:["e","*","e"],
         action:function(e1,e2){
         return e1*e2;
         }
         },
         {
         symbol:"f",
         rhs:["e","/","e"],
         action:function(e1,e2){
         return e1/e2;
         }
         },
         {
         symbol:"e",
         rhs:["(","e",")"],
         action:function(e){
         return e;
         }
         },
         {
         symbol:"e",
         rhs:["-","e"],
         action:function(e){
         return -e;
         }
         }*/
    ],

    lexer:{
        rules:[
            {
                regexp:/^\s+/
            },
            {
                regexp:/^[0-9]+(\.[0-9]+)?\b/,
                token:'NUMBER'
            },
            {
                regexp:/^\+/,
                token:'+'
            },
            {
                regexp:/^-/,
                token:'-'
            }
        ]
    }
});