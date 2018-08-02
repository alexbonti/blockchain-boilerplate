// @flow

const hackerNews = (): Promise<Object> => fetch("/api/hacker-news").then(result => result.json())

const move = (args: { sender: string, receiver: string, amount: number }): Promise<Object> =>
    fetch("/api/examplecc/move", {
        method: "POST",
        body: JSON.stringify(args),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })

const query = (target: string): Promise<number> =>
    fetch(`/api/examplecc/query/${target}`)
        .then(res => res.json())
        .then(json => json.result)
const queryAll = (): Promise<[number, number]> => Promise.all([query("a"), query("b")])

export default {
    hackerNews,
    move,
    query,
    queryAll
}
