def cntr(name,x1, y1, x2, y2, x3, y3, x4, y4):
    # 分母
    denom = (x3 - x1) * (y4 - y2) - (y3 - y1) * (x4 - x2)

    if denom == 0:
        return None  # 交点が定まらない（平行 or 同一直線）
    # パラメータt
    t = ((x2 - x1) * (y4 - y2) - (y2 - y1) * (x4 - x2)) / denom

    # 交点座標
    X = x1 + t * (x3 - x1)
    Y = y1 + t * (y3 - y1)
    X=int(X)
    Y=int(Y)
    print(name,",(",X,",",Y,")")

