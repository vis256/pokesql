import jester
import std/[strformat]

routes:
    post "/@name":
        let n = @"name"
        echo fmt"{n}"
        echo request.body
        resp Http200
