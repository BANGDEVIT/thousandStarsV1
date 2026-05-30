import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 h-screen">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Tạo tài khoản mới</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Tham gia cùng Thousand Stars để trải nghiệm những đặc quyền dành riêng cho giới thượng lưu.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email*</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <FieldDescription>
                 Chúng tôi sẽ dùng email này để liên hệ với bạn.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Họ và Tên*</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Trần Văn A"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password*</FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password*
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Ít nhất 8 kí tự.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Tạo tài khoàn</Button>
              </Field>
              
              <FieldDescription className="text-center">
                Đã có tài khoản? <a href="#" color="#775A19">Đăng nhập ngay</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="../../"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
