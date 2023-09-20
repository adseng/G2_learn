import pandas as pd
import json

df = pd.read_excel("111.xlsx", 'Sheet6', index_col=None)
data_list = []

# 遍历数据，从第二列开始
for index, row in df.iterrows():
    for column, cell_value in enumerate(row[1:], start=1):
        x = column - 1
        y = index
        data_list.append({'x': x, 'y': y, 'value': cell_value})

# 转换为 JSON 格式并输出到文件
with open('output.json', 'w') as file:
    json.dump(data_list, file, indent=4)

