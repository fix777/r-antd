const insertIndexAsKey = (src: any[] = []) => src.map((s, i: number) => Object.assign({}, s, { key: i }));

export default insertIndexAsKey;
