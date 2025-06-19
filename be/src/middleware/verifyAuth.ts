import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const verifyAuth = (req:Request, res:Response, next:NextFunction) => {
  try {
    const token = req.cookies?.jwt
    if (!token) res.status(401).json({ message: 'Unauthorized' })
    else {
      jwt.verify(token, process.env.TOKEN_SECRET!)
      next()
    }
  } catch (err) {
    console.error('Error: ', err)
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default verifyAuth;