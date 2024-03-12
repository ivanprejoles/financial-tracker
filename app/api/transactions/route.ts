import currentProfile from "@/lib/current-profile";
import db from "@/lib/prismadb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import { NextResponse } from "next/server";

export async function POST(req: Params) {
  try {
    const profile = await currentProfile()

    const {storeId, idReference = ''} = await req.json()
  
    if (!profile) {
      return new NextResponse('Unauthorized', {status: 401})
    }
  
    let transactions:any = await db.transactions.findMany({
      where: {
          idReference,
          storeId,
          NOT: {
            OR: [
                { isDeleted: true },
                { isArchive: true }
            ]
        }
      },
      orderBy: {
          createdAt: 'asc'
      }, 
    })
    
    Object.keys(transactions).forEach((key:any) => {
        transactions[key] = {
          ...transactions[key],
          createdAt: transactions[key].createdAt.toISOString(),
          updatedAt: transactions[key].createdAt.toISOString(),
          childrenKey: [],
        }
    });
  
    return NextResponse.json(transactions)

  } catch (error) {

    console.log('[SERVER ERROR]', error)
    return new NextResponse('Unauthorized', {status: 401})

  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const {
      values,
      storeId
    } = body

    const profile = await currentProfile()

    const transactions: any = await db.$transaction(
      Object.keys(values).map((item) => db.transactions.update({
        where: {
          id: item,
          profileId: profile?.id,
          storeId
        },
        data: {
          parentValue: values[item].rootedValue
        }
      }))
    )

    Object.keys(transactions).forEach((key:any) => {
      transactions[key] = {
        ...transactions[key],
        createdAt: transactions[key].createdAt.toISOString(),
        updatedAt: transactions[key].createdAt.toISOString(),
        childrenKey: []
      }
    });

    return NextResponse.json(transactions)
  } catch (error) {
    console.log('[SERVER ERROR]', error);
    return new NextResponse('Unauthorized', { status: 401 });
  }
}
