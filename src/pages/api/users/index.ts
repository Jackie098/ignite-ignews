/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

/** Because Next app's have a extra server node to create the HTML file for return
 * to client, this same server node, can to make requests, responses and store datas too
 */

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: "Diego" },
    { id: 3, name: "Carlos" },
    { id: 4, name: "Julia" },
  ];

  return response.json(users);
};
