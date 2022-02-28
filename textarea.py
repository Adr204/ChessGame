import tkinter

root = tkinter.Tk()
root.geometry('300x100')
root.title('text')

lbl = tkinter.Label(text='Diary')
lbl.place(x=30, y=30)

txt = tkinter.Entry(width=20)
txt.place(x=90, y=30)

root.mainloop()